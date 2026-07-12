!macro customInstall
  ; Kill any running instances of old or new app
  nsExec::Exec 'taskkill /f /im iMooAgentTool.exe'
  nsExec::Exec 'taskkill /f /im iMooDesktop.exe'
  Sleep 500
!macroend

!macro customUnInstall
  ; Clean up old desktop shortcuts
  Delete "$DESKTOP\iMooDesktop.lnk"
  Delete "$DESKTOP\iMooDesktop Setup.lnk"
!macroend
