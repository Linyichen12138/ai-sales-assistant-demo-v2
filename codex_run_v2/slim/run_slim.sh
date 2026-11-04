#!/bin/bash
# 用法: ROOT=... CODEX=... run_slim.sh p1a [p1b ...]   成功退出0；p1a 全档失败退出1
ROOT=${ROOT:-/workspace/销售助理项目/前端Demo}; CODEX=${CODEX:-codex}
cd "$ROOT"; S=codex_run_v2/slim; O=$S/orch.log
MODELS=(gpt-6.1-terra gpt-5.6-sol gpt-6-sol gpt-5.6-luna gpt-reserve gpt-6-luna gpt-5.6-terra gpt-6-astra gpt-6.1-sol)
mt(){ find src "$1" -type f -exec stat -c %Y {} + 2>/dev/null || find src "$1" -type f -exec stat -f %m {} +; }
for p in "$@"; do
  sed "s#ROOT#$ROOT#g" $S/base.txt > $S/prompt_$p.txt; cat $S/$p.txt >> $S/prompt_$p.txt
  img=$(awk -v p=$p '$1==p{print $2}' $S/img.map); IA=(); [ "$img" != "-" ] && IA=(-i "$ROOT/codex_run_v2/ref/$img")
  ok=0
  for m in "${MODELS[@]}"; do
    L=$S/${p}_$m.log; t0=$(date +%s); echo "$(date '+%F %T') start $p $m" >> $O
    "$CODEX" exec -m $m -c 'model_reasoning_effort="medium"' -s danger-full-access --dangerously-bypass-approvals-and-sandbox --skip-git-repo-check -C "$ROOT" "${IA[@]}" - < $S/prompt_$p.txt > $L 2>&1 &
    c=$!; bad=""
    while kill -0 $c 2>/dev/null; do sleep 20
      grep -q "at capacity" $L && { bad=cap; kill $c; break; }
      last=$(mt $L | sort -n | tail -1)
      grep -q "Reconnecting\|stream disconnected" $L && [ $(( $(date +%s) - last )) -gt 600 ] && { bad=stall; kill $c; break; }
      [ $(( $(date +%s) - t0 )) -gt 3000 ] && { bad=timeout; kill $c; break; }
    done
    wait $c; rc=$?
    if [ -z "$bad" ] && [ $rc = 0 ] && npm run build > $S/build_$p.log 2>&1; then
      echo "$(date '+%F %T') done $p $m $(( $(date +%s)-t0 ))s build ok" >> $O; ok=1; break
    fi
    echo "$(date '+%F %T') fail $p $m ${bad:-rc=$rc/build} $(( $(date +%s)-t0 ))s" >> $O
  done
  [ $ok = 1 ] || { echo "ALL MODELS FAILED $p" >> $O; exit 1; }
done
echo "ALLDONE $*" >> $O
