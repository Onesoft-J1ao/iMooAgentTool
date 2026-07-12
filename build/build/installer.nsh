!macro customInstall
  nsExec::Exec "taskkill /f /im iMooAgentTool.exe"
  Sleep 500
!macroend