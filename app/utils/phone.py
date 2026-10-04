import re


def normalize_phone(phone):
    return re.sub(r"\D", "", phone)