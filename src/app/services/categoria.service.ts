@Injectable({ providedIn: 'root' })
export class CategoriaService {

  private api = `${environment.apiUrl}/categorias`;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Categoria[]>(this.api);
  }
}
