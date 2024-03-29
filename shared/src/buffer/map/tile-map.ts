// automatically generated by the FlatBuffers compiler, do not modify

import * as flatbuffers from 'flatbuffers';

import { MapLayer } from '../../buffer/map/map-layer';
import { TileSet } from '../../buffer/map/tile-set';


export class TileMap {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
__init(i:number, bb:flatbuffers.ByteBuffer):TileMap {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsTileMap(bb:flatbuffers.ByteBuffer, obj?:TileMap):TileMap {
  return (obj || new TileMap()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsTileMap(bb:flatbuffers.ByteBuffer, obj?:TileMap):TileMap {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new TileMap()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

width():number {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.readUint16(this.bb_pos + offset) : 0;
}

height():number {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? this.bb!.readUint16(this.bb_pos + offset) : 0;
}

layers(index: number, obj?:MapLayer):MapLayer|null {
  const offset = this.bb!.__offset(this.bb_pos, 8);
  return offset ? (obj || new MapLayer()).__init(this.bb!.__indirect(this.bb!.__vector(this.bb_pos + offset) + index * 4), this.bb!) : null;
}

layersLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 8);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

tilesets(index: number, obj?:TileSet):TileSet|null {
  const offset = this.bb!.__offset(this.bb_pos, 10);
  return offset ? (obj || new TileSet()).__init(this.bb!.__indirect(this.bb!.__vector(this.bb_pos + offset) + index * 4), this.bb!) : null;
}

tilesetsLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 10);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

static startTileMap(builder:flatbuffers.Builder) {
  builder.startObject(4);
}

static addWidth(builder:flatbuffers.Builder, width:number) {
  builder.addFieldInt16(0, width, 0);
}

static addHeight(builder:flatbuffers.Builder, height:number) {
  builder.addFieldInt16(1, height, 0);
}

static addLayers(builder:flatbuffers.Builder, layersOffset:flatbuffers.Offset) {
  builder.addFieldOffset(2, layersOffset, 0);
}

static createLayersVector(builder:flatbuffers.Builder, data:flatbuffers.Offset[]):flatbuffers.Offset {
  builder.startVector(4, data.length, 4);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addOffset(data[i]!);
  }
  return builder.endVector();
}

static startLayersVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(4, numElems, 4);
}

static addTilesets(builder:flatbuffers.Builder, tilesetsOffset:flatbuffers.Offset) {
  builder.addFieldOffset(3, tilesetsOffset, 0);
}

static createTilesetsVector(builder:flatbuffers.Builder, data:flatbuffers.Offset[]):flatbuffers.Offset {
  builder.startVector(4, data.length, 4);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addOffset(data[i]!);
  }
  return builder.endVector();
}

static startTilesetsVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(4, numElems, 4);
}

static endTileMap(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}

static createTileMap(builder:flatbuffers.Builder, width:number, height:number, layersOffset:flatbuffers.Offset, tilesetsOffset:flatbuffers.Offset):flatbuffers.Offset {
  TileMap.startTileMap(builder);
  TileMap.addWidth(builder, width);
  TileMap.addHeight(builder, height);
  TileMap.addLayers(builder, layersOffset);
  TileMap.addTilesets(builder, tilesetsOffset);
  return TileMap.endTileMap(builder);
}
}
