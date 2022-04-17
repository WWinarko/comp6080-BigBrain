import { useEffect } from 'react';
import { withRouter } from 'react-router-dom';

// https://stackoverflow.com/questions/58598637/why-react-new-page-render-from-the-bottom-of-the-screen
function ScrollToTop({ history }) {
  useEffect(() => {
    const unlisten = history.listen(() => {
      window.scrollTo(0, 0);
    });
    return () => {
      unlisten();
    };
  });

  return (null);
}

export default withRouter(ScrollToTop);
