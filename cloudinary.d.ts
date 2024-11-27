declare module 'cloudinary' {
  export namespace v2 {
    function config(options: {
      cloud_name: string;
      api_key: string;
      api_secret: string;
    }): void;

    interface UploadApiResponse {
      secure_url: string;
      thumbnail_url?: string;
      duration?: number;
    }

    const uploader: {
      upload(
        file: string | Buffer, 
        options?: Record<string, any>
      ): Promise<UploadApiResponse>;
    };
  }
}
