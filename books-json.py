#!/usr/bin/env

import pandas as pd

if __name__ == '__main__':

    df = pd.read_csv('books.csv')
    df.to_json('books.json', 'records')
