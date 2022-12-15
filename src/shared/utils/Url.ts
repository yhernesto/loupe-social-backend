import { IsUrl, validateOrReject } from "class-validator";

interface Path {
  path: string
}

interface Parameter {
  name?: string
  value: string
}


export interface UrlINTF {
  url: string
}

export class Url implements UrlINTF{
  @IsUrl()
  url: string
  
  constructor(base_url: string){
    this.url = base_url
    this.validateMembers()
  }

  private validateMembers(){
    validateOrReject(this).catch(errors => {
      console.log('Promise rejected (validation failed). Errors: ', errors);
    });
  }

  public addPath(path: Path): void {
    if(this.url && !this.url.includes('?') && !this.url.includes('&')){
      this.url = this.url + '/' + path.path
    }
  }

  public addParameter(parameter: Parameter): void {
    if(this.url && this.url.includes('?')){
      if(!this.url.endsWith('&') && !this.url.endsWith('?')){
        this.url = this.url + '&'
      }
      if(parameter.name){
        this.url = this.url + parameter.name + '=' + parameter.value
      }else{
        this.url = this.url + parameter.value
      }
    }
  }

  public startQuery(): void{
    if(this.url && this.url.match(/[a-zA-z0-9]$/g) && !this.url.includes('?')){
      this.url = this.url + '?'
    }
  }
}