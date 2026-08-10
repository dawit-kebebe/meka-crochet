declare module '*.css' {
    const content: { [className: string]: string } | string;
    export default content;
}