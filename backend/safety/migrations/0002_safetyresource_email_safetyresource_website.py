from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [('safety', '0001_initial')]
    operations = [
        migrations.AddField(model_name='safetyresource', name='email', field=models.EmailField(blank=True, max_length=254)),
        migrations.AddField(model_name='safetyresource', name='website', field=models.URLField(blank=True)),
    ]
