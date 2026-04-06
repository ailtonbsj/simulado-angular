import { AnyArrayPipe } from './any-array.pipe';

describe('AnyArrayPipe', () => {
  it('create an instance', () => {
    const pipe = new AnyArrayPipe();
    expect(pipe).toBeTruthy();
  });
});
