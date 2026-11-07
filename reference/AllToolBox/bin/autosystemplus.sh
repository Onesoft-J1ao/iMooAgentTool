#!/system/bin/sh
EDXP_MANAGER="com.solohsu.android.edxp.manager"
PACKAGES="com.coderstory.toolkit com.huanli233.systemplus"

# 检查模块安装
for pkg in $PACKAGES; do
    if ! pm path "$pkg" >/dev/null 2>&1; then
        exit 1
    fi
done

# 【修复】提取UID时排除 sharedUserId，只取第一个 userId
get_app_uid() {
    dumpsys package "$1" | grep -E 'userId=' | grep -v 'sharedUserId' | head -1 | sed 's/.*userId=\([0-9]*\).*/\1/'
}

am force-stop "$EDXP_MANAGER"
sleep 1
# 以下路径全部改为 /data/data/
DATA_DIR="/data/data/$EDXP_MANAGER"
XML_FILE="$DATA_DIR/shared_prefs/enabled_modules.xml"
CONF_DIR="$DATA_DIR/conf"
ENABLED_LIST="$CONF_DIR/enabled_modules.list"
MODULES_LIST="$CONF_DIR/modules.list"
MODULES_TMP="$CONF_DIR/modules.list.tmp"

mkdir -p "$(dirname "$XML_FILE")"
mkdir -p "$CONF_DIR"

# 初始化 XML（如不存在）
if [ ! -f "$XML_FILE" ]; then
    echo '<?xml version="1.0" encoding="utf-8" standalone="yes" ?>' > "$XML_FILE"
    echo '<map>' >> "$XML_FILE"
    echo '</map>' >> "$XML_FILE"
fi

# 【修复】使用 grep -F 进行固定字符串匹配，避免包名中的 . 被当作正则通配符
for pkg in $PACKAGES; do
    if ! grep -Fq "<int name=\"$pkg\" value=\"1\" />" "$XML_FILE"; then
        sed -i "s/<\/map>//" "$XML_FILE"
        echo "    <int name=\"$pkg\" value=\"1\" />" >> "$XML_FILE"
        echo "</map>" >> "$XML_FILE"
    fi
done

# 提取启用的模块包名到 enabled_modules.list
sed -n 's/.*<int name="\([^"]*\)" value="1" \/>.*/\1/p' "$XML_FILE" > "$ENABLED_LIST"

# 生成 modules.list（写入 APK 路径）
> "$MODULES_TMP"
while read -r module; do
    apk_path=$(pm path "$module" | head -n 1 | cut -d: -f2)
    if [ -n "$apk_path" ]; then
        echo "$apk_path" >> "$MODULES_TMP"
    fi
done < "$ENABLED_LIST"

mv "$MODULES_TMP" "$MODULES_LIST"

# 修改文件所有者
EDXP_UID=$(get_app_uid "$EDXP_MANAGER")
if [ -n "$EDXP_UID" ]; then
    chown "$EDXP_UID:$EDXP_UID" "$XML_FILE"
    chown "$EDXP_UID:$EDXP_UID" "$ENABLED_LIST"
    chown "$EDXP_UID:$EDXP_UID" "$MODULES_LIST"
fi

# 【新增】恢复 SELinux 上下文，防止高版本 Android 因标签错误导致读取失败
if command -v restorecon >/dev/null 2>&1; then
    restorecon -R "$DATA_DIR/shared_prefs" 2>/dev/null
    restorecon -R "$CONF_DIR" 2>/dev/null
fi

