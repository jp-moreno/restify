echo "Setting up django backend"
cd restify
virtualenv -p /usr/bin/python3.8 venv
source venv/bin/activate
pip3 install -r requirments.txt
python3 manage.py makemigrations
python3 manage.py migrate

echo "Setting up react frontend"
cd ../restify-front
npm install
