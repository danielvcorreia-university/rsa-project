# echo "Stopping car1 application."
# sshpass -f password-nano ssh rsa-yarnie@10.1.1.5 'cd ~/vanetza ; pkill -f car.py'
# echo "Stopping bus application."
# sshpass -f password-xavier ssh jetsonrocket@100.73.222.7 'cd ~/vanetza ; pkill -f autobucha.py'
# echo "Stopping proxy server application."
# pkill -f server.py
# echo "Stopping docker containers at nano."
# sshpass -f password-nano ssh rsa-yarnie@10.1.1.5 'cd ~/vanetza ; docker-compose down'
# echo "Stopping docker containers at xavier."
# sshpass -f password-xavier ssh jetsonrocket@100.73.222.7 'cd ~/vanetza ; docker-compose down'
# echo "Stopping docker containers locally."
# docker-compose down

echo "Stopping car1 application."
pkill -f car.py
echo "Stopping bus application."
pkill -f autobucha.py
echo "Stopping proxy server application."
pkill -f server.py
echo "Stopping docker containers."
docker-compose down