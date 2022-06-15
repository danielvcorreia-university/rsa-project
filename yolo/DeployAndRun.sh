rm -rf project
mkdir -p project
echo "Copying files into paste to transfer."
cp coco.names yolo-object-detection.py yolov3.cfg yolov3.weights video3.mp4 project
echo "Removing previous .zip file."
rm -f project.zip
echo "Zipping files."
zip -rq project.zip project
echo "Transfering data to the jetson."
sshpass -f password ssh jetsonrocket@100.73.222.7 'mkdir -p ~/rsa'
sshpass -f password ssh jetsonrocket@100.73.222.7 'rm -rf ~/rsa/*'
sshpass -f password scp project.zip jetsonrocket@100.73.222.7:~/rsa/
echo "Decompressing data sent."
sshpass -f password ssh jetsonrocket@100.73.222.7 'cd ~/rsa/ ; unzip -uq project.zip'
echo "Ready to run the program at jetson node."
#sshpass -f password ssh jetsonrocket@100.73.222.7 'cd ~/rsa/project/ ; python3 yolo-object-detection.py'
