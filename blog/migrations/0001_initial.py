# Generated by Django 3.1.4 on 2021-01-03 12:43

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Content',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('published', models.DateTimeField(blank=True, null=True, verbose_name='Uveřejněno')),
            ],
        ),
        migrations.CreateModel(
            name='Podcast',
            fields=[
                ('content_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='blog.content')),
                ('embed', models.TextField(verbose_name='Vkládací kód')),
            ],
            options={
                'verbose_name': 'Podcast',
                'verbose_name_plural': 'Podcasty',
            },
            bases=('blog.content',),
        ),
        migrations.CreateModel(
            name='Post',
            fields=[
                ('content_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='blog.content')),
                ('title', models.CharField(max_length=256, verbose_name='Titulek')),
                ('author', models.CharField(blank=True, max_length=256, verbose_name='Autor')),
                ('content', models.TextField(verbose_name='Obsah')),
                ('modified', models.DateTimeField(blank=True, null=True, verbose_name='Upraveno')),
                ('draft', models.BooleanField(verbose_name='Je koncept?')),
                ('markdown', models.BooleanField(default=False, verbose_name='Používá Markdown?')),
                ('slug', models.SlugField()),
            ],
            options={
                'verbose_name': 'Článek',
                'verbose_name_plural': 'Články',
            },
            bases=('blog.content',),
        ),
    ]
