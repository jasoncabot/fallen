// automatically generated by the FlatBuffers compiler, do not modify

import * as flatbuffers from 'flatbuffers';

import { Province } from '../../buffer/data/province';


export class ProvinceLookup {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
__init(i:number, bb:flatbuffers.ByteBuffer):ProvinceLookup {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsProvinceLookup(bb:flatbuffers.ByteBuffer, obj?:ProvinceLookup):ProvinceLookup {
  return (obj || new ProvinceLookup()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsProvinceLookup(bb:flatbuffers.ByteBuffer, obj?:ProvinceLookup):ProvinceLookup {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new ProvinceLookup()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

provinces(index: number, obj?:Province):Province|null {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? (obj || new Province()).__init(this.bb!.__indirect(this.bb!.__vector(this.bb_pos + offset) + index * 4), this.bb!) : null;
}

provincesLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

static startProvinceLookup(builder:flatbuffers.Builder) {
  builder.startObject(1);
}

static addProvinces(builder:flatbuffers.Builder, provincesOffset:flatbuffers.Offset) {
  builder.addFieldOffset(0, provincesOffset, 0);
}

static createProvincesVector(builder:flatbuffers.Builder, data:flatbuffers.Offset[]):flatbuffers.Offset {
  builder.startVector(4, data.length, 4);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addOffset(data[i]!);
  }
  return builder.endVector();
}

static startProvincesVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(4, numElems, 4);
}

static endProvinceLookup(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}

static finishProvinceLookupBuffer(builder:flatbuffers.Builder, offset:flatbuffers.Offset) {
  builder.finish(offset);
}

static finishSizePrefixedProvinceLookupBuffer(builder:flatbuffers.Builder, offset:flatbuffers.Offset) {
  builder.finish(offset, undefined, true);
}

static createProvinceLookup(builder:flatbuffers.Builder, provincesOffset:flatbuffers.Offset):flatbuffers.Offset {
  ProvinceLookup.startProvinceLookup(builder);
  ProvinceLookup.addProvinces(builder, provincesOffset);
  return ProvinceLookup.endProvinceLookup(builder);
}
}
