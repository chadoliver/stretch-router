/// <reference path="./constants.ts"/>

module scene {

    import c = constants;
    
    export interface SceneConfig {
        parent: Element;
        width: number;
        height: number;
    }

    export class Scene {
        
        public OBSTACLES = 'obstacles';
        public ORBITS = 'orbits';
        public TRACKS = 'tracks';
        public LABELS = 'labels';
        public ANNOTATIONS = 'annotations';

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