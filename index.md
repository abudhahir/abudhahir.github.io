# Some tips
* update an object with a delta json 
'''
mapper.readerForUpdating(object).readValue(json);
'''


docs.spring.io/spring-cloud-dataflow/docs/current/reference/html/getting-started-deploying-spring-cloud-dataflow.html#getting-started-maven-configuration

As per the spring documentation, the maven localRepository is set to ${user.home}/.m2/repository/ by default.

Hence dont specify complete path of your artifact in the dashboard, rather specify maven resource details in the following format maven://group:artifact:version. Then spring dataflow server automatically picks it from your local maven repo.
