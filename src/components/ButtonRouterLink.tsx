import React, { FC, memo } from 'react';
import NextLink from 'next/link';
import { Link, LinkProps, useStyleConfig } from '@chakra-ui/react';

interface ButtonRouterLinkProps extends LinkProps {
  href: string;
  text: string;
}

const ButtonRouterLink: FC<ButtonRouterLinkProps> = ({
  href,
  text,
  children,
  ...props
}) => {
  const styles = useStyleConfig('Button', {
    ...props,
    colorScheme: 'blue',
  });

  return (
    <NextLink href={href} passHref>
      <Link
        sx={styles}
        display="inlineFlex"
        verticalAlign="middle"
        alignItems="center"
      >
        {text}
      </Link>
    </NextLink>
  );
};

export default memo(ButtonRouterLink);
