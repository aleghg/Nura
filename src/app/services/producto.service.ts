@Injectable({ providedIn: 'root' })
export class ProductoService {

  private api = `${environment.apiUrl}/productos`;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Producto[]>(this.api);
  }
}
