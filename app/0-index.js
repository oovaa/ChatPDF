import { fileURLToPath } from 'url';
import { dirname , join} from 'path';


const currentDir = dirname(fileURLToPath(import.meta.url));
const targetDir = join(dirname(dirname(currentDir)), 'ChatPDF', 'dbs', 'db');

console.log(targetDir);