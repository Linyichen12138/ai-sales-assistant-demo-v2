#!/bin/bash
cd /workspace/销售助理项目/前端Demo
MODELS=(gpt-5.6-luna gpt-reserve gpt-6-luna gpt-5.6-terra gpt-5.6-sol gpt-6-sol gpt-6.1-terra gpt-6-astra gpt-6.1-sol)
O=codex_run_v2/wb_orch.log
for p in ${PKGS:-p1 p2 p3 p4 p5 p6}; do
  ok=0
  for m in "${MODELS[@]}"; do
    cat codex_run_v2/common.txt codex_run_v2/$p.txt > codex_run_v2/prompt_wb_$p.txt
    log=codex_run_v2/wb2_${p}_$m.log
    echo "$(date) start $p $m" >> $O
    timeout 3000 codex exec -m $m -c 'model_reasoning_effort="medium"' -s danger-full-access --dangerously-bypass-approvals-and-sandbox --skip-git-repo-check -C /workspace/销售助理项目/前端Demo - < codex_run_v2/prompt_wb_$p.txt > $log 2>&1 &
    cpid=$!
    stalled=0
    while kill -0 $cpid 2>/dev/null; do
      sleep 30
      now=$(date +%s)
      last=$(find src $log -type f -printf '%T@\n' | sort -n | tail -1 | cut -d. -f1)
      if grep -q "at capacity" $log; then echo "$(date) cap $m" >> $O; kill $cpid; pkill -f "codex exec -m $m"; stalled=1; break; fi
      if grep -q "Reconnecting\|stream disconnected" $log && [ $((now-last)) -gt 600 ]; then
        echo "$(date) stall-kill $p $m" >> $O; pkill -P $cpid; kill $cpid; pkill -f "codex exec -m $m"; stalled=1; break
      fi
    done
    wait $cpid; rc=$?
    if [ $stalled = 1 ] || [ $rc -ne 0 ] || grep -q "at capacity" $log; then echo "$(date) fail rc=$rc $p $m" >> $O; continue; fi
    echo "$(date) done $p $m" >> $O; ok=1; break
  done
  [ $ok = 1 ] || { echo "ALL MODELS FAILED $p" >> $O; exit 1; }
done
echo ALLDONE >> $O
