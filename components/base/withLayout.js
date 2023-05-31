import Layout from './index';

const withLayout = (WrappedComponent) => {
  const HOCComponent = (props) => (
    <Layout>
      <WrappedComponent {...props} />
    </Layout>
  );

  return HOCComponent;
};

export default withLayout;
