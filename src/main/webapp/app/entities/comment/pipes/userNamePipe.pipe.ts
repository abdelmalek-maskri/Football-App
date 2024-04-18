import { Pipe, PipeTransform } from '@angular/core';
import { IUserProfile } from '../../user-profile/user-profile.model';
import { UserProfileService } from '../../user-profile/service/user-profile.service';
@Pipe({
  name: 'userNamePipe',
})
export class userNamePipe implements PipeTransform {
  private userProfiles: IUserProfile[] = [];

  constructor(private userProfileService: UserProfileService) {
    this.userProfileService.query().subscribe(res => {
      if (res.body != null) {
        this.userProfiles = res.body;
      }
    });
  }

  transform(id: number): string {
    const foundUser = this.userProfiles.find(userProfile => userProfile.id == id);
    return foundUser ? foundUser.name! : 'Unknown';
  }
}
