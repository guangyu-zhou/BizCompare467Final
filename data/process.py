import json
from pprint import pprint

import json
from pprint import pprint

'''
Orignal json:
{u'categories': [u'Korean'],
 u'endtime': 18,
 u'id': u'san-maru-champaign',
 u'image': u'https://s3-media1.fl.yelpcdn.com/bphoto/Wp5YQDAuPmPkBqvi54Ir-A/ms.jpg',
 u'latitude': 40.0819967,
 u'longitude': -88.2962051,
 u'name': u'San Maru',
 u'ratings_date': [167, 34, 114, 171, 75, 28, 18, 86, 349, 244, 185, 339],
 u'ratings_score': [4, 5, 5, 5, 5, 5, 5, 5, 5, 2, 4, 5],
 u'related': [u'old-time-meat-and-deli-shoppe-champaign'],
 u'starttime': 12}

'''


f = open('name_img.json', 'r')
# f = open('name_category.json', 'r')

j_file = json.load(f)
f.close()

# cats = set()
out_file = {}
for r in j_file:
	# pprint(r)
	# print len(r)
	for key in r:
		# print len(r[key]),
		out_file[key] = r[key]

print out_file
	# info = {'lat': r['latitude'], 'lon': r['longitude']}
	# out_file[r['id']] = {'info': info, 'related': r['related']}
	# print len(r['categories'])
	# for elem in r['categories']:
	# 	# print elem
	# 	cats.add(elem)
with open('name_img_dict.json', 'w') as outfile:
		json.dump(out_file, outfile, indent=4)


