## QSLIDER  | 1.0.0

## Installation

`` npm i @imagina/qslider@1.0.2 ``

## API Routes

| ENTITY  | ROUTE |
| ------------- | ------------- |
| Sliders | apiRoutes.qslider.sliders |
| Slides | apiRoutes.qslider.slides |

## Pages

- ### Back-End

  | PAGE | NAME |
  | ------------- | ------------- |
  | Sliders Index | qslider.admin.sliders |
 
### Component: carousel
- #### Usage 

    ```js
    import carouselComponent from '@imagina/qslider/_components/carousel';
    
    export default {
    components: {
     carouselComponent
    }
    };
    ```
 
    ```html
    <carousel-component id="[id slider]"></carousel-component>
    ```
