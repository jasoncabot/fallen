import os
import png
import struct
import math
import glob
import json

def run():
	maps = dict([parse_map(pam_file) for pam_file in glob.glob("./input/MAPS/*.PAM")])
	print(json.dumps(maps))
	# parse_file('./input/COLONIES/LGCOL1.CMP', './out/images/test.png', 32)
	# parse_file('./input/SIMG/ALIE_SI.ICA', './out/images/structures/alie_si.png', 32)
	# parse_file('./input/SIMG/ALIE_SSI.ICA', './out/images/structures/alie_ssi.png', 32)
	# parse_file('./input/UIMG/ALIE_SUI.ICA', './out/images/units/alie_sui.png', 32)
	# parse_file('./input/UIMG/ALIE_UI.ICA', './out/images/units/alie_ui.png', 32)
	# parse_file('./input/ANMS/CAT.ANM', './out/images/anim/cat.png')
	# parse_file('./input/TIMG/DESERT.ICA', './out/images/terrain/desert.png', 50)
	# parse_file('./input/ANMS/DGS.ANM', './out/images/anim/dgs.png')
	# parse_file('./input/ANMS/DMP.ANM', './out/images/anim/dmp.png')
	# parse_file('./input/ANMS/DMS.ANM', './out/images/anim/dms.png')
	# parse_file('./input/ANMS/DPS.ANM', './out/images/anim/dps.png')
	# parse_file('./input/TIMG/FOREST.ICA', './out/images/terrain/forest.png', 50)
	# parse_file('./input/SIMG/HUMA_SI.ICA', './out/images/structures/huma_si.png', 32)
	# parse_file('./input/SIMG/HUMA_SSI.ICA', './out/images/structures/huma_ssi.png', 32)
	# parse_file('./input/UIMG/HUMA_SUI.ICA', './out/images/units/huma_sui.png', 32)
	# parse_file('./input/UIMG/HUMA_UI.ICA', './out/images/units/huma_ui.png', 32)
	# parse_file('./input/ANMS/IMP.ANM', './out/images/anim/imp.png')
	# parse_file('./input/ANMS/IMPMEG.ANM', './out/images/anim/impmeg.png')
	# parse_file('./input/ANMS/IMPMISS.ANM', './out/images/anim/impmiss.png')
	# parse_file('./input/ANMS/KRY.ANM', './out/images/anim/kry.png')
	# parse_file('./input/ANMS/MMP.ANM', './out/images/anim/mmp.png')
	# parse_file('./input/SIMG/NEUT_SI.ICA', './out/images/structures/neut_si.png', 32)
	# parse_file('./input/SIMG/NEUT_SSI.ICA', './out/images/structures/neut_ssi.png', 32)
	# parse_file('./input/UIMG/NEUT_SUI.ICA', './out/images/units/neut_sui.png', 32)
	# parse_file('./input/UIMG/NEUT_UI.ICA', './out/images/units/neut_ui.png', 32)
	# parse_file('./input/ANMS/NUKE.ANM', './out/images/anim/nuke.png')
	# parse_file('./input/ANMS/POW.ANM', './out/images/anim/pow.png')
	# parse_file('./input/ANMS/RAD.ANM', './out/images/anim/rad.png')
	# parse_file('./input/ROADS/ROADS.ICA', './out/images/structures/infra.png', 17)
	# parse_file('./input/TIMG/ROCKY.ICA', './out/images/terrain/rocky.png', 50)
	# parse_file('./input/ANMS/SBI.ANM', './out/images/anim/sbi.png')
	# parse_file('./input/ANMS/X1B.ANM', './out/images/anim/x1b.png')
	# parse_file('./input/ANMS/X1S.ANM', './out/images/anim/x1s.png')
	# parse_file('./input/ANMS/XAS.ANM', './out/images/anim/xas.png')
	# parse_file('./input/ANMS/XHS.ANM', './out/images/anim/xhs.png')

def parse_map(input_name):

	terrains = ['desert', 'forest', 'rocky']

	touching_lookup = {
		"aberdeen": ["rock-castle","sparta","marshall","roanoke","creedmoor","garland"],
		"alma": ["bromont","granby","brome-lake"],
		"ayden": ["rock-castle","high-point","eagle-nest","snake-river","canuck"],
		"brimstone": ["norenda","thetfordmines"],
		"brome-lake": ["granby","alma","hull","norenda"],
		"bromont": ["lachine","sutton","rawdon","granby","alma"],
		"canuck": ["ayden","snake-river","point-harbour"],
		"cartasone": ["haven","eagle-nest","high-point","milos"],
		"chaos": ["garland","creedmoor"],
		"chertsy": ["rolland","sutton","rawdon","masson-lake"],
		"creedmoor": ["roanoke","aberdeen","garland","chaos"],
		"delos": ["sparta","marshall","kinabal","norwood"],
		"eagle-nest": ["haven","cartasone","high-point","ayden","snake-river"],
		"elkin": ["sparta", "milos"],
		"esterel": ["kamouraska","orford","valleyfield"],
		"free-city": ["lachine","sutton","rolland"],
		"garland": ["aberdeen","creedmoor","chaos"],
		"granby": ["rawdon","bromont","alma","brome-lake"],
		"haven": ["cartasone","eagle-nest"],
		"high-point": ["rock-castle","ayden","eagle-nest","cartasone","milos","sparta"],
		"hull": ["brome-lake","norenda","thetfordmines","sherbrooke"],
		"kamouraska": ["esterel","orford","three-rivers","sherbrooke"],
		"kinabal": ["norwood","delos","marshall"],
		"lachine": ["free-city","sutton","bromont"],
		"marshall": ["kinabal","delos","sparta","aberdeen","roanoke"],
		"masson-lake": ["chertsy","sherbrooke"],
		"milos": ["cartasone","high-point","sparta","elkin"],
		"norenda": ["brome-lake","hull","thetfordmines","brimstone"],
		"norwood": ["kinabal","delos"],
		"orford": ["esterel","valleyfield","three-rivers","kamouraska"],
		"point-harbour": ["snake-river","canuck"],
		"rawdon": ["chertsy","sutton","bromont","granby"],
		"roanoke": ["marshall","aberdeen","creedmoor"],
		"rock-castle": ["aberdeen","sparta","high-point","ayden"],
		"rolland": ["free-city","sutton","chertsy"],
		"sherbrooke": ["masson-lake","hull","thetfordmines","three-rivers","kamouraska"],
		"snake-river": ["eagle-nest","ayden","canuck","point-harbour"],
		"sparta": ["elkin","milos","high-point","rock-castle","aberdeen","marshall","delos"],
		"sutton": ["free-city","rolland","chertsy","rawdon","bromont","lachine"],
		"thetfordmines": ["three-rivers","sherbrooke","hull","norenda","brimstone"],
		"three-rivers": ["valleyfield","orford","kamouraska","sherbrooke","thetfordmines"],
		"valleyfield": ["esterel","orford","three-rivers"],
		"waterloo": [],
		"balkany": []
	}

	# used for temporarily calculating the terrain types
	# terrain_kinds = ['Void', 'Plain','Forest','Water','Mountain','Bridge','Rock']

	with open(input_name, 'rb') as pam:
		# 4 byte marker
		_ = struct.unpack('4s8x', pam.read(12))
		name, _, _ = [x.decode('ascii').replace('\00', '') for x in struct.unpack('24s24s24s', pam.read(24*3))]
		key = name.replace(' ', '-').lower()

		# exceptions
		if key == "sutton-lake":
			key = "sutton"
			name = "Sutton"
		if key == "brome-city":
			key = "brome-lake"
			name = "Brome Lake"

		terrain = terrains[struct.unpack('q', pam.read(8))[0]]
		energy, credits, research = struct.unpack('bbbx', pam.read(4))
		# discard the next 6112 - not sure what they are used for - they all start with NEUTRAL and some have a magic number
		# somewhere in it :/
		_ = pam.read(6112)
		width, height = struct.unpack('ii', pam.read(8)) # all maps are 48x48

		tiles = [[struct.unpack('BxxB12x', pam.read(16))[0] for row in range(height)] for column in range(width)]

		return (key, {
			        "width": width,
					"height": height,
					"name": name,
					"type": terrain,
					"energy": int(energy),
					"credits": int(credits),
					"research": int(research),
					"touching": touching_lookup[key],
					"tiles": tiles
		})


def parse_file(input_name, output_name, row_tile_count=1):
	palette = []
	all_imgs = []

	with open(input_name, 'rb') as ica:
		# 8 byte Magic CImageF
		magic = struct.unpack('8s', ica.read(8))[0].decode('ascii').replace('\00', '')
		# number of tiles - 2 byte little-endian
		number_of_tiles = struct.unpack('<h', ica.read(2))[0]
		print("File has " + str(number_of_tiles) + " tiles")

		# read 4 bytes for each colour in the palette
		for i in range(0, 256):
			color = struct.unpack('4B', ica.read(4))[::-1][1:]
			palette.append(color)

		max_width = 0
		max_height = 0
		for i in range(0, number_of_tiles):
			# 10 bytes for the object id
			tile_id = struct.unpack('4s6s', ica.read(10))[1].decode('ascii').replace('\00', ' ')

			tile_len = struct.unpack('3h', ica.read(6))[1]
			height, width = struct.unpack('2h', ica.read(4))

			print("read object " + tile_id + " w:"+str(width)+" h:"+str(height)+" tiles: "+str(tile_len))

			pixel_data = decompress(ica, tile_len, width, height)
			img = []
			for row in range(0, len(pixel_data)):
				img_row = []
				img.append(img_row)
				for pixel in pixel_data[row]:
					real_colour = palette[pixel]
					img_row.extend(real_colour)

			all_imgs.append(img)
			max_width = max(max_width, width)
			max_height = max(max_height, height)

		# some X1B.ANM contain tiles of different sizes and require transparent padding to the right and bottom
		spritesheet = []
		print("len(all_imgs) = " + str(len(all_imgs)) + " where number_of_tiles = " + str(number_of_tiles) + "")

		transparent_colour = palette[0]

		# for each tile, ensure it's exactly max_width and max_height
		for img in all_imgs:
			for row in img:
				# add transparent padding/columns to the right
				row.extend((max_width - int(len(row) / 3)) * transparent_colour)
			# add transparent padding/rows at the bottom
			for i in range(0, max_height - len(img)):
				img.append(max_width * transparent_colour)

		# Add each tile image to the spritesheet
		target_tile_count_row = row_tile_count # how many tiles we display on each row
		for idx, img in enumerate(all_imgs):
			target_row = math.floor(idx/target_tile_count_row)
			for row_idx, row in enumerate(img):
				target_row_idx = (target_row * max_height) + row_idx
				if target_row_idx + 1 > len(spritesheet):
					spritesheet.append([])
				spritesheet[target_row_idx].extend(row)

		# Ensure that the very last row is the same width as the others by extending with transparent pixels
		# [ 
		#  [ 1, 2, 3, 4, 5 ]
		#  [ 1, 2, 3, 4, 5 ]
		#  [ 1, 2, 3 ]
		# ]
		# becomes
		# [ 
		#  [ 1, 2, 3, 4, 5 ]
		#  [ 1, 2, 3, 4, 5 ]
		#  [ 1, 2, 3, 0, 0 ]
		# ]
		spritesheet_width = len(spritesheet[0])
		for row in spritesheet:
			count = spritesheet_width - len(row)
			if count == 0: continue
			additional = [colour for pixel in [transparent_colour] for colour in pixel] * int(count / len(transparent_colour))
			row.extend(additional)

		out_dir = os.path.dirname(output_name)
		if not os.path.exists(out_dir):
			os.makedirs(out_dir)

		with open(output_name, 'wb') as output:
			w = png.Writer(int(spritesheet_width / 3), len(spritesheet), transparent=transparent_colour)
			w.write(output, spritesheet)


def decompress(data, length, width, height):
	all_rows = []

	# read the number of bytes for this tile
	bytes_on_line = struct.unpack("B", data.read(1))[0]
	total_read = 1

	# while we have lines to read
	outer_loop = 0
	running = True
	while running:
		# read 3 bytes of padding
		padding = data.read(3)
		total_read += 3
		print("padding = " + str(padding))
		current_row = []
		all_rows.append(current_row)

		# while we have instructions to read on this line
		line_bytes_read = 3
		inner_loop = 0
		while line_bytes_read < bytes_on_line - 1:
			# read instruction
			current_instruction = data.read(4)
			total_read += 4
			line_bytes_read += 4
			num_pixels, pixel_colour, drawing_mode = struct.unpack("BBH", current_instruction)
			print("instruction = " + str(current_instruction) + " outer:" + str(outer_loop) + ", inner:" + str(inner_loop))
			print("scan_data :: num_pixels = " + str(num_pixels) + " pixel_colour = " + str(pixel_colour) + " drawing_mode:" + str(drawing_mode))

			if drawing_mode == 1:
				print("drawing compressed pixels " + str(num_pixels) + " of colour " + str(pixel_colour))
				current_row.extend(num_pixels * [pixel_colour])
			elif drawing_mode == 2:
				pixels = data.read(num_pixels)
				total_read += num_pixels
				line_bytes_read += num_pixels
				current_row.extend(pixels)
				print("drawing " + str(num_pixels) + " uncompressed pixels " + str(pixels))

			inner_loop += 1
			print("end of inner loop: line_bytes_read = " + str(line_bytes_read) + ", bytes_on_line = " + str(bytes_on_line))

		if len(current_row) < width:
			x = width - len(current_row)
			print("adding " + str(x) + " more to " + str(len(current_row)))
			current_row.extend(x * [0])
		if len(current_row) > width:
			del current_row[width:]
			print("removing new len = " + str(len(current_row)))
		print("produced = " + str(current_row))

		bytes_on_line = struct.unpack("B", data.read(1))[0]
		total_read += 1
		line_bytes_read += 1
		if total_read + bytes_on_line > length:
			print("warning 1 @ " + str(data.tell()) + " :: " + str(total_read) + " + " + str(bytes_on_line) + " > " + str(length) + " truncating to only read " + str(length - total_read))
			bytes_on_line = length - total_read

		if bytes_on_line == 0 and total_read < length:
			print("warning 2 @ " + str(data.tell()) + " :: was going to read 0 but we have " + str(length - total_read) + " left to read. Reading it...")
			bytes_on_line = length - total_read

		print("Finished reading line, moving to next, which is " + str(bytes_on_line) + ", read = " + str(total_read) + ", total = " + str(length))
		outer_loop += 1

		if total_read >= length:
			print("ending " + str(total_read) + " >= " + str(length))
			running = False

	while len(all_rows) < height:
		all_rows.append(width * [0])

	print("Finished reading tile " + str(len(all_rows)) + ", read " + str(total_read) + "/" + str(length))
	all_rows.reverse()
	return all_rows
