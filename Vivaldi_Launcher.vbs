Set objShell = CreateObject("WScript.Shell")

' 1. Executa o módulo de manutenção e aguarda a conclusão completa
objShell.Run "powershell.exe -ExecutionPolicy Bypass -File ""E:\Program Files\Vivaldi\Vivaldi Mods\mechMaintenanceModule.ps1""", 1, True

' 2. Dispara a inicialização do Vivaldi e encerra o processo do script (.vbs)
objShell.Run """E:\Program Files\Vivaldi\Application\vivaldi.exe""", 1, False