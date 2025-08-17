import { sha1 } from 'js-sha1';
import ApiService from './api_request';
import {
  useActiveProfileStore,
  type UpdateProfileResponse,
  type User,
} from '@/stores/activeProfile';
import { faIconsList } from '@/constants/font-awesome';
import { randomHexColorGenerator } from '@/util/colorGenerator';

export default class UserService {
  private apiRequest;
  private activeProfileStore;

  constructor() {
    this.apiRequest = new ApiService();
    this.activeProfileStore = useActiveProfileStore();
  }

  public async login(email: string, password: string, callback: (isSuccess: boolean) => void) {
    this.activeProfileStore.setLoading(true);
    const encryptedPassword = sha1(password).toString();
    const loginObject = {
      email,
      password: encryptedPassword,
    };

    try {
      const response = await this.apiRequest.post<User>('user/login', loginObject);
      this.activeProfileStore.setLoading(false);
      this.activeProfileStore.setActiveProfile(response);
      this.activeProfileStore.setError(null);
      return callback(true);
    } catch (error: any) {
      this.activeProfileStore.setLoading(false);
      this.activeProfileStore.setError(new Error(error));
      return callback(false);
    }
  }

  public async logout() {
    this.activeProfileStore.setLoading(true);
    try {
      await this.apiRequest.get<User>('user/logout');
      this.activeProfileStore.setLoading(false);
      this.activeProfileStore.setActiveProfile(null);
      this.activeProfileStore.setError(null);
    } catch (error: any) {
      this.activeProfileStore.setLoading(false);
      this.activeProfileStore.setError(new Error(error));
    }
  }

  public async signup(
    email: string,
    password: string,
    name: string,
    username: string,
    callback: (isSuccess: boolean) => void,
  ) {
    this.activeProfileStore.setLoading(true);
    const encryptedPassword = sha1(password).toString();
    const randomIcon = faIconsList[Math.floor(Math.random() * faIconsList.length)];
    const randomColor = randomHexColorGenerator();

    const registerObject = {
      email,
      password: encryptedPassword,
      fullName: name,
      name: username,
      icon: randomIcon,
      color: randomColor,
    };

    try {
      const response = await this.apiRequest.post<User>('user/register', registerObject);
      this.activeProfileStore.setLoading(false);
      this.activeProfileStore.setActiveProfile(response);
      this.activeProfileStore.setError(null);

      return callback(true);
    } catch (error: any) {
      this.activeProfileStore.setLoading(false);
      this.activeProfileStore.setError(new Error(error));

      return callback(false);
    }
  }

  public async updateProfile(
    callback: (isSuccess: boolean) => void,
    name: string,
    username: string,
  ) {
    this.activeProfileStore.setLoading(true);

    const updatedProfile = {
      email: this.activeProfileStore.activeProfile?.email,
      fullName: name,
      name: username,
      icon: this.activeProfileStore.activeProfile?.icon,
      color: this.activeProfileStore.activeProfile?.color,
    };

    try {
      const response = await this.apiRequest.post<UpdateProfileResponse>(
        'user/update',
        updatedProfile,
      );
      this.activeProfileStore.setLoading(false);
      this.activeProfileStore.setActiveProfile(response.user);
      this.activeProfileStore.setError(null);

      return callback(true);
    } catch (error: any) {
      this.activeProfileStore.setLoading(false);
      this.activeProfileStore.setError(new Error(error));
      return callback(false);
    }
  }

  public async updatePreferences(
    newColor: string,
    newIcon: string,
    callback: (isSuccess: boolean) => void,
  ) {
    this.activeProfileStore.setLoading(true);
    const formattedColor = newColor.includes('#') ? newColor : `#${newColor}`;
    alert(formattedColor);
    const updatedProfile = {
      icon: newIcon || this.activeProfileStore.activeProfile?.icon,
      color: this.activeProfileStore.activeProfile?.color,
    };

    try {
      const response = await this.apiRequest.post<UpdateProfileResponse>(
        'user/updatePreferences/',
        updatedProfile,
      );
      this.activeProfileStore.setLoading(false);
      this.activeProfileStore.setActiveProfile(response.user);
      this.activeProfileStore.setError(null);

      return callback(true);
    } catch (error: any) {
      this.activeProfileStore.setLoading(false);
      this.activeProfileStore.setError(new Error(error));
      return callback(false);
    }
  }

  public async updatePassword(
    currentPassword: string,
    newPassword: string,
    callback: (isSuccess: boolean) => void,
  ) {
    this.activeProfileStore.setLoading(true);

    const updatedProfile = {
      fullName: this.activeProfileStore.activeProfile?.fullName,
      name: this.activeProfileStore.activeProfile?.name,
      email: this.activeProfileStore.activeProfile?.email,
      password: sha1(currentPassword).toString(),
      newPassword: sha1(newPassword).toString(),
    };

    try {
      const response = await this.apiRequest.post<UpdateProfileResponse>(
        'user/update',
        updatedProfile,
      );
      this.activeProfileStore.setLoading(false);
      this.activeProfileStore.setActiveProfile(response.user);
      this.activeProfileStore.setError(null);

      return callback(true);
    } catch (error: any) {
      this.activeProfileStore.setLoading(false);
      this.activeProfileStore.setError(new Error(error));
      return callback(false);
    }
  }
}
