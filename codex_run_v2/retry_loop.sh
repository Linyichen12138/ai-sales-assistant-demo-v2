#!/bin/bash
# 每15分钟一轮在 box 上跑 run.sh（p1 起，成功则串行跑到 p6）；18:00 后不再开新轮并停掉 codex
cd /workspace/销售助理项目/前端Demo
O=codex_run_v2/wb_orch.log
while [ $(date +%H%M) -lt 1800 ]; do
  echo "=== retry_loop round $(date)" >> $O
  codex_run_v2/run.sh & r=$!
  while kill -0 $r 2>/dev/null; do
    sleep 30
    if [ $(date +%H%M) -ge 1800 ] && [ ! -d src/workbench ]; then echo "$(date) 18:00 stop" >> $O; pkill -f run.sh; pkill -f "codex exec"; exit 0; fi
  done
  tail -1 $O | grep -q ALLDONE && exit 0
  grep -q "done p1" <(sed -n '/retry_loop round/h;//!H;${x;p}' $O) && exit 0
  sleep 900
done
echo "$(date) retry_loop ended (18:00)" >> $O
