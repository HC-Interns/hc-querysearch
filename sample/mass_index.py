import json
import sys

import requests


API_BASE = 'http://localhost:4141'
ENDPOINT_ADD = API_BASE + '/fn/consumer/addRecord'
ENDPOINT_INDEX = API_BASE + '/fn/holodex/index'
ENDPOINT_SEARCH = API_BASE + '/fn/holodex/search'


def add_comment(c, i):
    title=c['author']
    body=c['body']
    payload = {
        'title': title,
        'body': {
            'text': body
        }
    }

    # add to consumer
    res = requests.post(ENDPOINT_ADD, json=payload)
    if not res.ok:
        raise Exception('[add] line ' + str(i) + ': ' + res.text)

    # index in holodex
    entryHash = res.json()
    res = requests.post(ENDPOINT_INDEX, json={
        'entryType': 'record',
        'entryHash': entryHash
    })
    if not res.ok:
        raise Exception('[index] line ' + str(i) + ': ' + res.text)


def parse_sample_data():
    with open('sample_data.json', 'r') as f:
        for i, line in enumerate(f):
            if i % 100 == 0: print(i)
            print('.', end='')
            sys.stdout.flush()
            c = json.loads(line)
            add_comment(c, i)

if __name__ == '__main__':
    parse_sample_data()