import slackify from 'slackify-markdown';
import utf8 from 'utf8';

export function slackifyDescription(metadata) {
    let description = (metadata.attributes.additionalInformation ?
        metadata.attributes.additionalInformation.description :
        metadata.attributes.additionalAttributes.description);

    description = utf8.decode(description)
    description = description.replace('] (', '](');
    description = description.replace('\n', '\\n');
    let descriptionForSlack = slackify(description);
    return descriptionForSlack;
}

export function searchMetadata(myArray) {
    for (var i = 0; i < myArray.length; i++) {
        if (myArray[i].type === "metadata") {
            return myArray[i];
        }
    }
}