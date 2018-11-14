rem 上传前预处理命令 检查server地址是否为正式地址
rem 微信开发者工具-详情中勾选启用自定义处理命令，并在上传前预处理中输入 beforeUpload.bat 地址，该地址即为你的脚本所在位置。如果是修改 project.config.json 文本内容添加的，还是需要在微信开发者工具中手动勾选下启动自定义处理命令，默认开发者工具是不开启这个选项的

@echo off
setlocal enabledelayedexpansion

rem 正式server地址
set api_server1='https://www.shpWx.com'

echo %api_server%

cd src
echo "正在读取config.js"

for /f "tokens=*" %%f in ('findstr  /i "%api_server1%" config.js') do (
 echo "====================="%%f
 goto :end
)
echo "[错误]config.js[_server]配置错误,上传包前请执行gulp build -o 命令"
exit 42

:end
echo "config.js配置成功,正在上传代码!"


