from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in finance_app/__init__.py
from finance_app import __version__ as version

setup(
	name="finance_app",
	version=version,
	description="This Application Use for who has business running",
	author="Prashant Kamble",
	author_email="kambleprashant@outlook.com",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
