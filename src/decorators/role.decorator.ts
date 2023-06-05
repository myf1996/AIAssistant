import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';

const RoleGuard = (...role: string[]): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(ctx: ExecutionContext) {
      const request = ctx.switchToHttp().getRequest();
      const user = request.user;
      return role.includes(user.role);
    }
  }

  return mixin(RoleGuardMixin);
};

export default RoleGuard;
