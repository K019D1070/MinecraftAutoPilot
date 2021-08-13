# Minecraft auto pilot

## 概要 / about
rcon-client使ってサーバー止めて止まったのを確認してから終了するようになってだけ

## 使い方 / instructions
start.batなりstart.shにstop.statusを出させるようにしとかないとサーバーが落ちたことを検出できない

うちの環境の例
```rem !start.bat

@echo OFF
echo %date% %time%
cd /d %~dp0
title Minecraft Server
color 2F
echo running > stop.status
java -Xms16G -Xmx16G -XX:+UseG1GC -server -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1NewSizePercent=40 -XX:G1MaxNewSizePercent=50 -XX:G1HeapRegionSize=16M -XX:G1ReservePercent=15 -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:InitiatingHeapOccupancyPercent=20 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1 -Dusing.aikars.flags=https://mcflags.emc.gs -Daikars.new.flags=true -jar paper-1.17.1-166.jar -nogui
echo stopped> stop.status
exit
```
runningステータスは特に必要ない
```rem !maintenance.bat
@echo OFF
cd /d %~dp0
set PATH=%PATH%;D:\data\script\nodeJS\autoPilot\node
title Minecraft Auto Maintenance
echo "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^" >> ./logs\backup.log
echo ========== >> ./logs\backup.log
date /t >> ./logs\backup.log
echo ========== >> ./logs\backup.log
node "D:\data\script\nodeJS\autoPilot\src\index.js" >> ./logs\backup.log
cd /d %~dp0
start /min !backup.bat every
exit
```
このスクリプトの`node "D:\data\script\nodeJS\autoPilot\src\index.js" >> ./logs\backup.log`のとこでこのプロジェクトを使ってます
```!backup.bat
@echo OFF
cd /d %~dp0
title Minecraft Auto Backup
rem .ignoreにあるファイル･フォルダを除外してtmp以下にコピー
xcopy /Y /C /D /E /exclude:.ignore * D:\tmp\mc_kamata >> ./logs\backup.log
rem 取り敢えずファイルはコピーしたのでサーバー起動
if "%~1"=="every" (
  start !start.bat
)
rem コピーしたやつを圧縮
7z a -bt -md=1536m -mfb=273 -mmt=16 -mx=9 -snh -snl -slp -sse -mqs=on -sdel ".\back\%date:~0,4%%date:~5,2%%date:~8,2%%time:~0,2%%time:~3,2%%time:~6,2%_autosave.7z" "D:\tmp\mc_kamata\*" >> ./logs\backup.log
exit
```

## 余談
linuxだったらGNU screen上でMinecraftサーバーを立てて管理の自動化をするんだろうけどWindowsだと近いソリューションがないのでこのようなものを作った

サーバーを止めるプラグインを使うより何やってるか把握しやすいのでNode.jsで書いた(Javaが書けたらプラグイン作ってたかも)
