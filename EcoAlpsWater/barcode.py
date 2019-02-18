import math
import barcode


class Barcode:

    def __init__(self, string_id):
        self.string_id = string_id
        self.number_id = Barcode.convert_to_number(self.string_id)

    @staticmethod
    def convert_to_number(string_id):
        return int.from_bytes(string_id.encode(), 'little')

    @staticmethod
    def convert_from_number(number_id):
        return number_id.to_bytes(math.ceil(number_id.bit_length() / 8), 'little').decode()
