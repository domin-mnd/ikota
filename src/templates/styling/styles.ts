/** A styled-components template string, not the entire file because of syntax & import */
export default `import styled from 'styled-components';

const padding = "1rem";

export const Button = styled.button\`
  appearance: none;
\`

export const Container = styled.div\`
  padding: \${padding};
\``;
