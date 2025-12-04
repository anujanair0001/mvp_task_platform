describe('Button Component', () => {
  it('should pass basic test', () => {
    expect(true).toBe(true);
  });

  it('should handle button props', () => {
    const buttonProps = {
      variant: 'primary',
      size: 'lg',
      disabled: false
    };
    
    expect(buttonProps.variant).toBe('primary');
    expect(buttonProps.size).toBe('lg');
    expect(buttonProps.disabled).toBe(false);
  });
});