# Django Backend

## How to Run
 Pkgs
```bash
pip install -r requirements.txt
pip install -U django djangorestframework 
pip install djangorestframework_simplejwt
pip install django-cors-headers
pip install django-filter
pip install mysqlclient
(sudo apt install python3-dev libmysqlclient-dev)
# https://django-rest-framework-simplejwt.readthedocs.io/en

python manage.py createsuperuser --email admin@admin.com --username admin

```

```bash
source env/bin/activate 
python manage.py migrate
python manage.py runserver
```