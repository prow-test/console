import { IServiceSpec, IServicePort } from './../../shared/datamodel/k8s/service';
import { IContainer } from './../../shared/datamodel/k8s/container';
import { IPodTemplate, IPodTemplateSpec } from './../../shared/datamodel/k8s/pod-template';
import { IMetaData } from './../../shared/datamodel/k8s/generic/meta-data';
import { IFunction, IFunctionSpec } from './../../shared/datamodel/k8s/function';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs/observable/of';
import { Lambda } from '../../shared/datamodel/k8s/function';
import { catchError, map, tap } from 'rxjs/operators';
import { AppConfig } from '../../app.config';
import { IDeployment, IDeploymentSpec, Deployment } from '../../shared/datamodel/k8s/deployment';

@Injectable()
export class LambdaDetailsService {

  constructor(private http: HttpClient) {
  }

  /** GET Lambda by name and namespace. Will 404 if name not found */
  getLambda(name: string, namespace: string, token: string): Observable<Lambda> {
    const httpOptions = this.getHTTPOptions(token);
    const url = `${AppConfig.kubelessApiUrl}/namespaces/${namespace}/functions/${name}`;
    return this.http.get<Lambda>(url, httpOptions);
  }

  /** DELETE Lambda by name and namespace. Will 404 if name not found */
  deleteLambda(name: string, namespace: string, token: string): Observable<Lambda> {
    const httpOptions = this.getHTTPOptions(token);
    const url = `${AppConfig.kubelessApiUrl}/namespaces/${namespace}/functions/${name}`;
    return this.http.delete<Lambda>(url, httpOptions);
  }

  /** PUT: update Lambda */
  updateLambda(func: Lambda, token: string): Observable<Lambda> {
    const httpOptions = this.getHTTPOptions(token);
    const url = `${AppConfig.kubelessApiUrl}/namespaces/${func.metadata.namespace}/functions/${func.metadata.name}`;
    return this.http.put<Lambda>(url, func, httpOptions);
  }

  /** POST: create Lambda */
  createLambda(func: Lambda, token: string): Observable<Lambda> {
    const httpOptions = this.getHTTPOptions(token);
    const url = `${AppConfig.kubelessApiUrl}/namespaces/${func.metadata.namespace}/functions/${func.metadata.name}`;
    return this.http.post<Lambda>(url, func, httpOptions);
  }

  getHTTPOptions(token: string): object {
    let httpHeaders: any;
    httpHeaders = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return httpHeaders;
  }

  initializeLambda(): Lambda {
    const md: IMetaData = {
      name: '',
      namespace: '',
      labels: {
        'created-by': 'kubeless'
      }
    }
    const con: IContainer = {
      name: '',
      image: '',
      env: [],
      resources: {}
    };

    const podSpec: IPodTemplateSpec = {
      containers: [con]
    };

    const podTemplate: IPodTemplate = {
      spec: podSpec
    };

    const depSpec: IDeploymentSpec = {
      template: podTemplate
    };

    const dep = new Deployment ({
      spec: depSpec,
    });

    const svcPort: IServicePort = {
      name: 'http-function-port',
      protocol: 'TCP',
      port: 8080,
      targetPort: 8080
    };

    const svcSpec: IServiceSpec = {
      ports: [svcPort],
      selector: {}
    };

    const funcSpec: IFunctionSpec = {
      handler: 'handler.main',
      runtime: 'nodejs6',
      deps: '',
      function: '',
      type: 'HTTP',
      deployment: dep,
      service: svcSpec,
    };

    const lambda = new Lambda({
      kind: 'Function',
      apiVersion: 'kubeless.io/v1beta1',
      metadata: md,
      spec: funcSpec
    })
    lambda.spec['function-content-type'] = 'text';
    return lambda;
  }
}
