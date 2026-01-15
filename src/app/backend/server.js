import express from 'express';
import multer from 'multer';
import cors from 'cors';
import oracledb from 'oracledb';

const app = express();
app.use(cors());
app.use(express.json());

// Multer para recibir archivos
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Configuración Oracle
const dbConfig = {
  user: 'TIENDA',
  password: 'tienda123',
  connectString: 'localhost:1521/xe'
};

// Endpoint para subir producto con imagen
app.post('/productos', upload.single('imagen'), async (req, res) => {
  const { nombre, descripcion, precio, stock, id_categoria } = req.body;
  const imagen = req.file ? req.file.buffer : null;

  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const sql = `
      INSERT INTO PRODUCTOS (
        ID_PRODUCTO, NOMBRE, DESCRIPCION, PRECIO, STOCK, ID_CATEGORIA, VERSION, ACTIVO, IMAGEN_BLOB
      )
      VALUES (
        ISEQ$$_76282.nextval, :nombre, :descripcion, :precio, :stock, :id_categoria, 0, 1, :imagen
      )
    `;

    await connection.execute(
      sql,
      { nombre, descripcion, precio, stock, id_categoria, imagen },
      { autoCommit: true }
    );

    res.json({ mensaje: 'Producto guardado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al guardar producto');
  } finally {
    if (connection) await connection.close();
  }
});

// Endpoint para obtener productos
app.get('/productos', async (req, res) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT ID_PRODUCTO, NOMBRE, DESCRIPCION, PRECIO, STOCK, ID_CATEGORIA, IMAGEN_BLOB FROM PRODUCTOS`
    );

    const productos = result.rows?.map(row => ({
      id: row[0],
      nombre: row[1],
      descripcion: row[2],
      precio: row[3],
      stock: row[4],
      id_categoria: row[5],
      imagen: row[6] ? Buffer.from(row[6]).toString('base64') : null
    }));

    res.json(productos);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener productos');
  } finally {
    if (connection) await connection.close();
  }
});

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
