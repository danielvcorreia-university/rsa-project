# echo "Running docker containers at nano1."
# sshpass -f password-nano ssh rsa-yarnie@10.1.1.5 'cd ~/vanetza ; docker-compose up -d'
# echo "Running docker containers at xavier."
# sshpass -f password-xavier ssh jetsonrocket@100.73.222.7 'cd ~/vanetza ; docker-compose up -d'
# echo "Running car1 application at nano1."
# sshpass -f password-nano ssh rsa-yarnie@10.1.1.5 'cd ~/vanetza ; python3 car.py &'
# echo "Running bus application at xavier."
# sshpass -f password-xavier ssh jetsonrocket@100.73.222.7 'cd ~/vanetza ; python3 autobucha.py &'
# echo "Running proxy server application locally."
# python3 server.py &'
# echo "Running react docker container locally."
# docker-compose up -d
# echo "Running react application in browser."
# firefox http://localhost:3000/ &

echo "Running docker containers locally."
docker-compose up -d
echo "Running car1 application."
python3 car.py &
echo "Running bus application."
python3 autobucha.py &
echo "Running proxy server application."
python3 server.py &
echo "Running react application in browser."
firefox http://localhost:3000/ &