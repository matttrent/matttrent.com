#!/usr/bin/env

import pandas as pd

if __name__ == '__main__':

    df = pd.read_csv('books.csv')

    categories = (
        df
        [~df.category.isnull()]
        .category.unique()
    )

    for cat in categories:
        subdf = df[df.category == cat]    
        subdf.to_json(f'src/books-{cat}.json', 'records')

    subdf = df[df.category.isnull()]
    subdf.to_json('src/books-rest.json', 'records')
