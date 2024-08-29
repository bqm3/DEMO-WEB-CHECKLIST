import serve from 'serve';

const options = {
  port: 3636,
  directory: './build', // Thư mục build của React
};

serve(options);
