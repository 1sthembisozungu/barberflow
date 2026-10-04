import re


def generate_customer_number(first_name, last_name, phone):
    first = re.sub(r"[^A-Za-z]", "", first_name).upper()
    last = re.sub(r"[^A-Za-z]", "", last_name).upper()

    first_part = first[:5]
    last_part = last[:1]

    phone_digits = re.sub(r"\D", "", phone)

    phone_part = phone_digits[-4:]

    return f"{first_part}{last_part}-{phone_part}"