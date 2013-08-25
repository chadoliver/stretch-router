/// <reference path="./common.ts"/>

/*
<svg id="context" width="688" height="350">
    <g id="obstacles"></g>
    <g id="innerOrbits"></g>
    <g id="outerOrbits"></g>
    <g id="tracks"></g>
    <g id="labels"></g>
</svg>
*/

module scene {

    import g = geometry;
    import c = constants;
    
    export interface SceneConfig {
        parent: Element;
        width: number;
        height: number;
    }

    export class Scene {

        public groups : {
            obstacles :Element;
            orbits :Element;
            tracks :Element;
            labels :Element;
            annotations :Element;
        };

        constructor (config:SceneConfig) {
            
            var svg :Element = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
            svg.setAttribute("width", config.width.toString());
            svg.setAttribute("height", config.height.toString());
            config.parent.insertBefore(svg, config.parent.firstChild);
            
            var obstacles = document.createElementNS("http://www.w3.org/2000/svg", 'g');
            obstacles.setAttribute("class", "obstacles");
            svg.appendChild(obstacles);
            
            var orbits = document.createElementNS("http://www.w3.org/2000/svg", 'g');
            orbits.setAttribute("class", "orbits");
            svg.appendChild(orbits);
            
            var tracks = document.createElementNS("http://www.w3.org/2000/svg", 'g');
            tracks.setAttribute("class", "tracks");
            svg.appendChild(tracks);
            
            var labels = document.createElementNS("http://www.w3.org/2000/svg", 'g');
            labels.setAttribute("class", "labels");
            svg.appendChild(labels);
            
            var annotations = document.createElementNS("http://www.w3.org/2000/svg", 'g');
            annotations.setAttribute("class", "annotations");
            svg.appendChild(annotations);
            
            this.groups = {
                obstacles: obstacles,
                orbits: orbits,
                tracks: tracks,
                labels: labels,
                annotations: annotations,
            };
        }
    }
}