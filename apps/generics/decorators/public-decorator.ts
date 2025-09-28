import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const IS_PUBLIC = 'isPublic';

export const Public = function (): CustomDecorator<string> {
  return SetMetadata(IS_PUBLIC, true);
};
