import { Pipe, PipeTransform } from '@angular/core';
import { IUserProfile } from '../../user-profile/user-profile.model';
import { UserProfileService } from '../../user-profile/service/user-profile.service';
@Pipe({
  name: 'userNamePipe',
})
export class userNamePipe implements PipeTransform {
  transform(id: number, userProfiles: IUserProfile[]): string {
    const foundUser = userProfiles.find(userProfile => userProfile.id === id);
    if (foundUser?.name && typeof foundUser.name != undefined) {
      return foundUser?.name;
    } else {
      return 'Unknown Name';
    }
    return 'Unknown Name';
  }
}
