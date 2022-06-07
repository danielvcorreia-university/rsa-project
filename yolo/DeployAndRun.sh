rm -rf project
mkdir -p project
echo "Copying files into paste to transfer."
cp coco.names yolo-object-detection.py yolov3.cfg yolov3.weights video3.mp4 project
echo "Removing previous .zip file."
rm -f project.zip
echo "Zipping files."
zip -rq project.zip project
echo "Transfering data to the jetson."
sshpass -f password ssh rsa-yarnie@100.108.253.83 'mkdir -p ~/rsa'
sshpass -f password ssh rsa-yarnie@100.108.253.83 'rm -rf ~/rsa/*'
sshpass -f password scp project.zip rsa-yarnie@100.108.253.83:~/rsa/
echo "Decompressing data sent."
sshpass -f password ssh rsa-yarnie@100.108.253.83 'cd ~/rsa/ ; unzip -uq project.zip'
echo "Ready to run the program at jetson node."
#sshpass -f password ssh rsa-yarnie@100.108.253.83 'cd ~/rsa/project/ ; python3 yolo-object-detection.py'
