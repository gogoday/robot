# 添加所有文件到索引库；
echo "add..."
git add --all

# 输入提交信息；
echo Commit Message:
read message
echo "-----------------------"

# 将变更内容提交到缓存区；
echo "commit..."
git commit -m $message 

# 将数据提交到远程仓库；
echo "push..."
git push origin master

echo "-----------------------"
echo "恭喜，数据提交成功！"
read
