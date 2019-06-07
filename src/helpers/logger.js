/**
 * Simple logger that
 * seperates production
 * from development logs
 */
module.exports = (name) => {
  const env = process.env.NODE_ENV;
  return (content, production) => {
    if (content instanceof Error) {
      console.error(`${name}: ${env === 'development' ? content : content.message}`);
    } else if (env === 'development' || production) {
      console.log(`${name}: ${content}`);
    }
  };
};
